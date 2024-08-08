import type { CSSProperties } from 'react';

export interface Category {
    color: CSSProperties['color'];
    id: string;
    dates: Date[];
}

export interface HighlightedDateStyle {
    backgroundColor: CSSProperties['backgroundColor'];
    color: CSSProperties['color'];
}

export interface HighlightedDates {
    dates: Date[];
    style: HighlightedDateStyle;
}

export interface Period {
    startDate: Date;
    endDate?: Date;
}
