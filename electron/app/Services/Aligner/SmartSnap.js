import { screen } from 'electron';

const self = {
    //private
    min_y: 30,
    max_x: 140,
    margin: 5,
    screen: null,
    initial_bounds: null,
    rects: [],
    invalid_positions: [],

    run(direction, panel, bounds) {
        if ( ['left', 'right'].includes(direction) ) {
            bounds.y = self.min_y;
        }

        self.initial_bounds = bounds;
        self.invalid_positions = [];
        self.screen = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y});

        self.getOpenPanelsAsRects(direction, panel);
        bounds = self[`searchPosition${Str.ucfirst(direction)}`](bounds);

        //set min width and height
        bounds.width = bounds.width < 40 ? 40 : bounds.width;
        bounds.height = bounds.height < 40 ? 40 : bounds.height;

        //set max width and height
        bounds.width = bounds.width > self.screen.workArea.width - self.max_x ? self.screen.workArea.width - self.max_x : bounds.width;
        bounds.height = bounds.height > self.screen.workArea.height - self.min_y ? self.screen.workArea.height - self.min_y : bounds.height;

        return bounds;
    },

    //private
    searchPositionTop(bounds, offset = 0) {
        let rect = {
            x1: bounds.x,
            y1: bounds.y + offset,
            x2: bounds.x + bounds.width,
            y2: bounds.y + bounds.height + offset,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) && rect.x1 < self.rects[i].x2 ) {
               bounds.x = self.rects[i].x2 + self.margin;

               if ( bounds.x + bounds.width > self.screen.workArea.width + self.screen.workArea.x - self.max_x ) {
                   bounds.x = self.screen.workArea.x;
                   offset = self.getYOffsetForTop(bounds, offset);
                   bounds.y = bounds.y + offset;

                   return self.searchPositionTop(bounds, offset);
               }
           }

           //check if position was already invalidated
           if ( self.wasPositionInvalidated(bounds) ) {
               continue;
           }

           break;
       }

       //validate position
       if ( !self.validatePosition(bounds) ) {
           return self.searchPositionTop(self.initial_bounds);
       }

       return bounds;
    },

    //private
    searchPositionBottom(bounds, offset = 0) {
        let rect = {
            x1: bounds.x,
            y1: bounds.y - offset,
            x2: bounds.x + bounds.width,
            y2: bounds.y + bounds.height - offset,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) && rect.x1 < self.rects[i].x2 ) {
               bounds.x = self.rects[i].x2 + self.margin;

               if ( bounds.x + bounds.width > self.screen.workArea.width + self.screen.workArea.x - self.max_x ) {
                   bounds.x = self.screen.workArea.x;
                   offset = self.getYOffsetForBottom(bounds, offset);
                   bounds.y = bounds.y - offset;

                   return self.searchPositionBottom(bounds, offset);
               }
           }

           //check if position was already invalidated
           if ( self.wasPositionInvalidated(bounds) ) {
               continue;
           }

           break;
       }

       //validate position
       if ( !self.validatePosition(bounds) ) {
           return self.searchPositionBottom(self.initial_bounds);
       }

       return bounds;
    },

    //private
    searchPositionLeft(bounds, offset = 0) {
        let rect = {
            x1: bounds.x + offset,
            y1: bounds.y,
            x2: bounds.x + bounds.width + offset,
            y2: bounds.y + bounds.height,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) && rect.y1 < self.rects[i].y2 ) {
               bounds.y = self.rects[i].y2 + self.margin;

               if ( bounds.y + bounds.height > self.screen.workArea.height ) {
                   bounds.y = self.min_y;
                   offset = self.getXOffsetForLeft(bounds, offset);
                   bounds.x = bounds.x + offset;

                   return self.searchPositionLeft(bounds, offset);
               }
           }

           //check if position was already invalidated
           if ( self.wasPositionInvalidated(bounds) ) {
               continue;
           }

           break;
       }

       //validate position
       if ( !self.validatePosition(bounds) ) {
           return self.searchPositionLeft(self.initial_bounds);
       }

       return bounds;
    },

    //private
    searchPositionRight(bounds, offset = 0) {
        let rect = {
            x1: bounds.x - offset,
            y1: bounds.y,
            x2: bounds.x + bounds.width - offset,
            y2: bounds.y + bounds.height,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) && rect.y1 < self.rects[i].y2 ) {
               bounds.y = self.rects[i].y2 + self.margin;

               if ( bounds.y + bounds.height > self.screen.workArea.height ) {
                   bounds.y = self.min_y;
                   offset = self.getXOffsetForRight(bounds, offset);
                   bounds.x = bounds.x - offset;

                   return self.searchPositionRight(bounds, offset);
               }
           }

           //check if position was already invalidated
           if ( self.wasPositionInvalidated(bounds) ) {
               continue;
           }

           break;
       }

       //validate position
       if ( !self.validatePosition(bounds) ) {
           return self.searchPositionRight(self.initial_bounds);
       }

       return bounds;
    },

    //private
    getYOffsetForTop(bounds, offset = 0) {
        let rect = {
            x1: bounds.x,
            y1: bounds.y + offset,
            x2: bounds.x + bounds.width,
            y2: bounds.y + bounds.height + offset,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) ) {
               return self.rects[i].y2 - self.rects[i].y1 + offset + self.margin;
           }
       }

       return offset;
    },

    //private
    getYOffsetForBottom(bounds, offset = 0) {
        let rect = {
            x1: bounds.x,
            y1: bounds.y - offset,
            x2: bounds.x + bounds.width,
            y2: bounds.y + bounds.height - offset,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) ) {
               return self.rects[i].y2 - self.rects[i].y1 + offset + self.margin;
           }
       }

       return offset;
    },

    //private
    getXOffsetForLeft(bounds, offset = 0) {
        let rect = {
            x1: bounds.x + offset,
            y1: bounds.y,
            x2: bounds.x + bounds.width + offset,
            y2: bounds.y + bounds.height,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) ) {
               return self.rects[i].x2 - self.rects[i].x1 + offset + self.margin;
           }
       }

       return offset;
    },

    //private
    getXOffsetForRight(bounds, offset = 0) {
        let rect = {
            x1: bounds.x - offset,
            y1: bounds.y,
            x2: bounds.x + bounds.width - offset,
            y2: bounds.y + bounds.height,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) ) {
               return self.rects[i].x2 - self.rects[i].x1 + offset + self.margin;
           }
       }

       return offset;
    },

    //private
    async getOpenPanelsAsRects(direction, current_panel) {
        let panels = await Model.Panel.findAll();
        let rects = [];

        for ( let i = 0; i < panels.length; i++ ) {
            if ( panels[i].id == current_panel.id ) {
                continue;
            }

            if ( !PANEL_WINDOWS[panels[i].id] ) {
                continue;
            }

            rects.push({
                name: panels[i].name,
                x1: panels[i].window_settings.x,
                y1: panels[i].window_settings.y,
                x2: panels[i].window_settings.x + panels[i].window_settings.width,
                y2: panels[i].window_settings.y + panels[i].window_settings.height,
            });
        }

        //sort rects
        rects.sort((a, b)=> {
            if ( a.x1 === b.x1 ) {
                if ( direction == 'top' ) {
                    return a.y1 < b.y1 ? -1 : 1;
                }
                else if ( direction == 'bottom' ) {
                    return a.y1 > b.y1 ? -1 : 1;
                }
            }
            else {
                if ( direction == 'left' ) {
                    return a.x1 < b.x1 ? -1 : 1;
                }
                else if ( direction == 'right' ) {
                    return a.x1 > b.x1 ? -1 : 1;
                }
            }
        });

        self.rects = rects;
    },

    //private
    validatePosition(bounds) {
        let rect = {
            x1: bounds.x,
            y1: bounds.y,
            x2: bounds.x + bounds.width,
            y2: bounds.y + bounds.height,
        };

        for ( let i = 0; i < self.rects.length; i++ ) {
           if ( self.rectanglesTouch(rect, self.rects[i]) ) {
               self.invalid_positions.push(bounds);
               return false;
           }
       }

       return true;
    },

    //private
    wasPositionInvalidated(bounds) {
        for ( let invalid_bounds of self.invalid_positions ) {
            if ( invalid_bounds.x == bounds.x && invalid_bounds.y == bounds.y ) {
                return true;
            }
        }

        return false;
    },

    rectanglesTouch(a, b) {
        // has horizontal gap
        if (a.x1 > b.x2 || b.x1 > a.x2) return false;

        // has vertical gap
        if (a.y1 > b.y2 || b.y1 > a.y2) return false;

        return true;
    },
}

export default self;
