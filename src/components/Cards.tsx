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
        <div className="card h-100">
            {imageURL && (
                <img
                    src={imageURL}
                    className="card-img-top"
                    alt={cardTitle}
                />
            )}
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{cardTitle}</h5>
                {cardText && <p className="card-text">{cardText}</p>}
                <div className="mt-auto">
                  {children}
                </div>
                {linkButton && (
                    <a href={linkButton} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">
                        Go to site
                    </a>
                )}
            </div>
        </div>
    );
};

export default Card;