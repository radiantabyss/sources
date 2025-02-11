import fs from 'fs-extra';

let self = {
    async update(panel) {
        if ( !panel.theme || panel.theme != 'custom') {
            return;
        }

        let filename = `${STATIC_PATH}/custom-themes/${panel.id}.css`;
        let css_contents = self.getCss(panel.theme_settings);
        let contents = css_contents;

        if ( await fs.exists(filename) ) {
            contents = await fs.readFile(filename, 'utf-8');
            contents = contents.replace(/\/\* managed by cmdeck \*\/.*?\/\* end managed by cmdeck \*\//s, css_contents);
        }

        await fs.writeFile(filename, contents);

        if ( !IS_PACKAGED ) {
            await fs.writeFile(`${STATIC_PATH}/../public/custom-themes/${panel.id}.css`, contents);
        }
    },

    //private
    getCss(settings) {
        let text_color = `rgba(${settings.text_color.r}, ${settings.text_color.g}, ${settings.text_color.b}, ${settings.text_color.a})`;
        let bg_color = `rgba(${settings.bg_color.r}, ${settings.bg_color.g}, ${settings.bg_color.b}, ${settings.bg_color.a})`;
        let highlight_color = `rgba(${settings.highlight_color.r}, ${settings.highlight_color.g}, ${settings.highlight_color.b}, ${settings.highlight_color.a})`;
        let highlight_color_shadow = `rgba(${settings.highlight_color.r}, ${settings.highlight_color.g}, ${settings.highlight_color.b}, 0.5)`;
        let bg_image = settings.bg_image;

        return `
/* managed by cmdeck */
.theme--custom .frameless-header span {
    background: linear-gradient(90deg, ${bg_color} 8px, transparent 1%) center,
        linear-gradient(${bg_color} 8px, transparent 1%) center,
        ${highlight_color};
    background-size: 10px 10px;
}

.theme--custom .frameless-header svg {
    color: ${highlight_color};
}

.theme--custom .frameless-header div {
    background: ${bg_color};
}

.theme--custom .panel {
    filter: drop-shadow(2px 10px 15px ${highlight_color_shadow});
}

@media (max-width: 250px) {
    .theme--custom .panel {
        border-color: ${highlight_color};
        background: ${bg_color};
    }
}

@media (max-width: 140px) {
    .theme--custom .panel {
        background: ${bg_color};
    }
}

@media (max-width: 100px) {
    .theme--custom .panel {
        background: ${bg_color};
    }
}

@media (max-height: 210px) {
    .theme--custom .panel {
        border-color: ${highlight_color};
        background: ${bg_color};
    }
}

@media (max-height: 130px) and (min-width: 141px) {
    .theme--custom .panel {
        border-color: ${highlight_color};
        background: ${bg_color};
    }
}

.theme--custom .panel > svg {
    color: ${highlight_color};
}

.theme--custom .panel__background {
    border-color: ${highlight_color};
    background: ${bg_color};
}

.theme--custom .panel__top {
    border-bottom-color: #2b1f50;
}

.theme--custom * {
    --bg-color: ${bg_color};
}

.theme--custom .edit-live span {
    color: ${text_color};
}

.theme--custom .swatch-label .edit-live .input {
    color: ${text_color};
}

.theme--custom .swatch {
    color: ${text_color};
}

#app.theme--custom {
    ${bg_image ? 'background-image: url(\''+bg_image+'\');' : ''}
    background-size: ${settings.bg_image_style == 'cover' ? 'cover' : 'initial'};
    background-repeat: ${settings.bg_image_style == 'repeat' ? 'repeat' : 'no-repeat'};
}
/* end managed by cmdeck */
        `;
    },
}

export default self;
