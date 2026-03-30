
import type { ButtonProps } from '@nuxt/ui'

export default interface CtaProps {
    label: string
    link: string
    color?: ButtonProps['color']
    variant?: ButtonProps['variant']
    size?: ButtonProps['size']
    icon?: string
}