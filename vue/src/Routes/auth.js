Route.group(['NotLogged'], () => {
    Route.get('/login', 'Auth/User/LoginAction');
    Route.get('/register', 'Auth/User/RegisterAction');
    Route.get('/forgot-password', 'Auth/User/RegisterAction');
    Route.get('/forgot-password', 'Auth/User/ForgotPasswordAction');
    Route.get('/reset-password/{code}', 'Auth/User/ResetPasswordAction');
    Route.get('/accept-invite', 'Auth/User/AcceptInviteAction');
});

Route.group(['Logged'], () => {
    Route.get('/logout', 'Auth/User/LogoutAction');
    Route.get('/auth/user/account', 'Auth/User/AccountAction');
    Route.get('/auth/team/new', 'Auth/Team/NewAction');
    Route.get('/auth/team/edit/{id}', 'Auth/Team/EditAction');
});
