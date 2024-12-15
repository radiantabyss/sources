<script>
import Dropzone from "dropzone";

export default {
    name: 'ImageUploadComponent',
    props: {
        modelValue: {
            type: String,
            required: false,
            default: '',
        },
        path: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: false,
            default: () => { return __('Upload Image'); },
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            dz: null,
            inited: false,
            loading: false,
        }
    },
    methods: {
        remove() {
            this.$emit('update:modelValue', '');

            if ( this.dz.files.length ) {
                this.dz.removeFile(this.dz.files[0]);
            }
        },
    },
    mounted() {
        if ( this.inited || !this.$refs.dropzone ) {
            return;
        }

        this.inited = true;

        this.dz = new Dropzone(this.$refs.dropzone, {
            url: `${back_url}${this.path}?jwt_token=${localStorage.getItem('jwt_token')}`,
            thumbnailWidth: 150,
            maxFiles: 1,
            maxFilesize: 5,
            previewsContainer: '.dropzone-preview',
        });

        this.dz.on('addedfile', () => {
            this.loading = true;
        });

        this.dz.on('complete', () => {
            this.loading = false;
        });

        this.dz.on('success', (e, response) => {
            this.$emit('update:modelValue', response.data.path);
        });

        this.dz.on('error', (e, response) => {
            if ( response.errors ) {
                Alert.show(response.errors.join('<br/>'), 'error');
            }
            else if ( typeof response === 'string') {
                Alert.show(response, 'error');
            }
        });
    }
}
</script>

<template>
<div class="image-upload" :class="loading ? 'image-upload--loading' : ''">
    <div class="dropzone-preview"></div>

    <div class="image-upload__upload" ref="dropzone">
        <div class="image-upload__image">
            <img :src="uploads_url + modelValue" v-if="modelValue" />
            <sprite id="image" v-else />
        </div>

        <div class="image-upload__text" v-show="!modelValue">
            {{ text }}
        </div>
    </div>

    <a @click="remove" class="image-upload__remove" v-show="modelValue">
        <sprite id="x" /> <t>Remove</t>
    </a>

    <div class="image-upload__loading" v-if="loading">
        <sprite id="request-spinner" />
    </div>
</div>
</template>
