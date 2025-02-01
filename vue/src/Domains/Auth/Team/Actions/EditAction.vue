<script>
import Details from './../Partials/Details';
import Members from './../Partials/Members';

export default {
    components: { Details, Members },
}
</script>

<template>

<div>
    <div class="page-title">
        <div>
            Edit Team
            <div class="crumbs">
                <router-link to="/"><sprite id="home" /></router-link>
                <sprite id="arrow-right" />
                <router-link to="/auth/user/account">My Account</router-link>
                <sprite id="arrow-right" />
                <span>Edit Team</span>
            </div>
        </div>
    </div>

    <tabs>
        <tabs-menu>
            <a>Details</a>
            <a>Members</a>
        </tabs-menu>
        <tabs-content>
            <Details />
            <Members />
        </tabs-content>
    </tabs>
</div>
</template>
