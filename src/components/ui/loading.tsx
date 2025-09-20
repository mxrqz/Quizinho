import './loader.css'

interface Loader {
    className?: string
}

export default function Loader({ className = '' }: Loader) {

    return (
        <div className={`loader ${className}`}>
            <div className="cell d-0"></div>
            <div className="cell d-1"></div>
            <div className="cell d-2"></div>
            <div className="cell d-1"></div>
            <div className="cell d-2"></div>
            <div className="cell d-2"></div>
            <div className="cell d-3"></div>
            <div className="cell d-3"></div>
            <div className="cell d-4"></div>
        </div>
    )
}