<script>
export default {
    name: 'Company',
    data() {
        return {
            fields: {},
        }
    },
    methods: {
        async submit(e) {
            let fields = {
                _event: e,
                ...this.fields,
            };

            await Request.post(`/company/create`, fields, true);
            Alert.show(__('Company details updated!'), 'success');

            //update user
            let data = await Request.get('/auth/user/get');
            this.$store.commit('Auth/SET', data.item);
        },
    },
    mounted() {
        this.fields = Auth.user.company || {};
    },
}
</script>

<template>
<form class="panel col-50">
    <div class="subtitle"><t>Company Details</t></div>

    <div class="grid-2 gap-15">
        <div class="row m-0">
            <label><t>Name</t></label>
            <input type="text" class="input" v-model="fields.name" />
        </div>
        <div class="row m-0">
            <label><t>Registration Number</t></label>
            <input type="text" class="input" v-model="fields.registration_number" />
        </div>
        <div class="row m-0">
            <label><t>VAT Number</t></label>
            <input type="text" class="input" v-model="fields.vat_number" />
        </div>
        <div class="row m-0">
            <label><t>Address</t></label>
            <input type="text" class="input" v-model="fields.address" />
        </div>
        <div class="row m-0">
            <label><t>Email</t></label>
            <input type="text" class="input" v-model="fields.email" />
        </div>
        <div class="row m-0">
            <label><t>Phone</t></label>
            <input type="text" class="input" v-model="fields.phone" />
        </div>
        <div class="row m-0">
            <label><t>Invoice Series</t></label>
            <input type="text" class="input" v-model="fields.invoice_series" />
        </div>
        <div class="row m-0">
            <label><t>Bank Account</t></label>
            <input type="text" class="input" v-model="fields.bank_account" />
        </div>
    </div>

    <div class="row row--submit mt-15">
        <button type="submit" @click.prevent="submit" class="btn btn--medium"><t>Save Changes</t></button>
    </div>
</form>
</template>
