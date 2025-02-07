let handleOutsideClick;

let self = {
    mounted(el, binding, vnode) {
        // Here's the click/touchstart handler
        // (it is registered below)
        handleOutsideClick = (e) => {
            e.stopPropagation();
            // Get the handler method name and the exclude array
            // from the object used in v-closable
            const { handler, exclude } = binding.value;
            // This variable indicates if the clicked element is excluded
            let clickedOnExcludedEl = false;

            function checkExcluded(el, target) {
                if (el._isVue) {
                    el.$children.forEach(child => checkExcluded(child.$el, target));
                }
                else if (el.contains(target)) {
                    clickedOnExcludedEl = true;
                }
            }

            exclude.forEach(refName => {
                // Access $refs through binding.instance instead of vnode.context
                const excludedEl = binding.instance.$refs[refName];
                if (excludedEl) {
                    checkExcluded(excludedEl, e.target);
                }
            });

            if (!el.contains(e.target) && !clickedOnExcludedEl) {
                // Call the method on the component instance (binding.instance)
                binding.instance[handler]();
            }
        };

        // Register click/touchstart event listeners on the whole page
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
    },
    unmounted() {
        // If the element that has v-closable is removed, then
        // unbind click/touchstart listeners from the whole page
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('touchstart', handleOutsideClick);
    }
};

export default self;
