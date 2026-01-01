import { useEffect, useRef } from "react"

const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
    const dimension = useRef({width: 0, height: 0})
    useEffect(() => {
        if (ref && ref.current) {
            dimension.current.width = ref.current.offsetWidth
            dimension.current.height = ref.current.offsetHeight
        }
    }, [ref])
    return dimension.current
}
export default useDimensions        