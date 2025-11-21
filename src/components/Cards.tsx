import type { ReactNode } from "react";

interface CardProps {
    cardTitle: string;
    cardText?: string;
    linkButton?: string;
    imageURL?: string;
    children?: ReactNode;
}

const Card = ({ cardTitle, cardText, linkButton, imageURL, children }: CardProps) => {
    return (
        <div className="card" style={{ width: "18rem" }}>
            {imageURL && (
                <img
                    src={imageURL}
                    className="card-img-top"
                    alt={cardTitle}
                />
            )}
            <div className="card-body">
                <h5 className="card-title">{cardTitle}</h5>
                {cardText && <p className="card-text">{cardText}</p>}
                {children}
                {linkButton && (
                    <a href={linkButton} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                        Go to site
                    </a>
                )}
            </div>
        </div>
    );
};

export default Card;