<script>
export default {
    props: {
        modelValue: {
            type: [String, Number],
            required: false,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            term: this.modelValue,
            timeout: null,
        }
    },
    methods: {
        updateContent(editor) {
            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.$emit('update:modelValue', editor.getContent());
            }, 200);
        },
    },
    mounted() {
        tinymce.init({
            skin: "oxide-dark",
            content_css: "dark",
            skin_url: '/tinymce/skins/ui/oxide-dark',
            branding: false,
            selector: '[data-tinymce]',
            width: '100%',
            height: '400px',
            resize: "both",
            plugins: [
                "advlist autolink lists link code paste hr image",
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link hr | insertfile image",
            content_style: 'body { font-family: \'Montserrat\'}',
            inline_boundaries: false,
            relative_urls: true,
            remove_script_host: false,
            automatic_uploads: true,

            // Handle image uploads
            images_upload_handler: function (blobInfo, success, failure) {
                // Use FileReader to convert image into base64 string
                var reader = new FileReader();
                reader.onload = function(e) {
                    success(e.target.result);  // Call success with base64 string result
                };
                reader.onerror = function() {
                    failure('Image conversion failed. Please try again.');
                };
                reader.readAsDataURL(blobInfo.blob());  // Convert the image to a data URL
            },

            setup: editor => {
                editor.on('Change', () => {
                    this.updateContent(editor);
                });
                editor.on('keyup', () => {
                    this.updateContent(editor);
                });
            },
        });
    }
}
</script>

<template>
<textarea data-tinymce data-gramm_editor="false" spellcheck="false">{{ this.modelValue }}</textarea>
</template>
