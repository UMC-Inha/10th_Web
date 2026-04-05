import type { ReactNode } from "react"

interface LinkProp{
    to:string
    children:ReactNode
    setPath: (to:string) => void
}
const Link = ({to, children, setPath}:LinkProp) => {
    const onClick = (to:string) => {
      const changeUrl = (e:React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        history.pushState({path:to}, "", to)
        setPath(to)
      }
      return changeUrl
    }
    return(<a href = {to} onClick={onClick(to)}>{children}</a>)
}

export default Link