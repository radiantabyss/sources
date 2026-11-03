package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

const (
	pingInterval = 30 * time.Second
	writeWait    = 10 * time.Second
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func getToken(r *http.Request) string {
	auth := r.Header.Get("Authorization")
	if strings.HasPrefix(auth, "Bearer ") {
		return strings.TrimPrefix(auth, "Bearer ")
	}

	return r.URL.Query().Get("jwt_token")
}

func parseJWT(tokenStr string) (string, error) {
	jwt_token, err := jwt.Parse(tokenStr, func(jwt_token *jwt.Token) (interface{}, error) {
		if _, ok := jwt_token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", jwt_token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil || !jwt_token.Valid {
		return "", fmt.Errorf("Unauthorized")
	}

	claims := jwt_token.Claims.(jwt.MapClaims)
	user_id := fmt.Sprintf("%v", claims["id"])

	return user_id, nil
}

// wsHandler upgrades the connection and relays the user's Redis pub/sub channel
// over the socket. A read pump (discarding messages) detects client disconnects
// and pong replies; a ticker sends periodic pings so the client (and any
// middleboxes) can detect a dead connection and reconnect.
func wsHandler(redis_client *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenStr := getToken(r)
		user_id, err := parseJWT(tokenStr)

		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("upgrade error:", err)
			return
		}
		defer conn.Close()

		sub := redis_client.Subscribe(ctx, "user:"+user_id)
		defer sub.Close()

		message_channel := sub.Channel()
		done := make(chan struct{})

		go func() {
			defer close(done)
			for {
				if _, _, err := conn.ReadMessage(); err != nil {
					return
				}
			}
		}()

		ticker := time.NewTicker(pingInterval)
		defer ticker.Stop()

		for {
			select {
			case <-done:
				return

			case <-r.Context().Done():
				return

			case msg := <-message_channel:
				conn.SetWriteDeadline(time.Now().Add(writeWait))
				if err := conn.WriteMessage(websocket.TextMessage, []byte(msg.Payload)); err != nil {
					return
				}

			case <-ticker.C:
				conn.SetWriteDeadline(time.Now().Add(writeWait))
				if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
					return
				}
			}
		}
	}
}

func main() {
	env_err := godotenv.Load()
	if env_err != nil {
		log.Fatal("Error loading .env file")
	}

	redis_client := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
	})

	http.HandleFunc("/", wsHandler(redis_client))

	fmt.Println("listening on port " + os.Getenv("PORT"))
	http.ListenAndServe(":"+os.Getenv("PORT"), nil)
}
