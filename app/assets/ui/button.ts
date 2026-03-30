export default {
    slots: {
        base: 'rounded-xl font-bold transition-transform transition-shadow transition-colors duration-300 justify-center text-center group motion-safe:hover:-translate-y-0.5',
        trailingIcon: 'shrink-0 inline-block transition-transform duration-300 motion-safe:group-hover:translate-x-1',
    },
    variants: {
        size: {
            lg: {
                base: 'px-6 py-4 sm:py-3 sm:px-8 text-lg rounded-4xl',
            }
        }
    }
}
