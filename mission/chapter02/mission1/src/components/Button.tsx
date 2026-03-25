interface BtnProp{
    type?: "submit"| "button" | "reset"
    label:string,
    onClick: () => void
    className:string
}

const Button = ({type = "button", label, onClick, className}:BtnProp) => {
    return(
        <button type={type} className={className} onClick={onClick}>{label}</button>
    )
}

export default Button