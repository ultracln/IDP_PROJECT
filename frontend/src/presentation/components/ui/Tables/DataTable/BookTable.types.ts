export interface BookTableRow {
    id: string;
    title: string;
    author: string;
    publishedYear: number;
    genre?: string;
    available?: boolean;
}

export interface BookTableProps {
    rows: BookTableRow[];
    onRowClick?: (row: BookTableRow) => void;
    loading?: boolean;
    error?: string;
}