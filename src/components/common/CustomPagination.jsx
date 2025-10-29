import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            onPageChange(page);
        }
    };

    const renderPageItems = () => {
        const pageItems = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageItems.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    {i + 1}
                </Pagination.Item>
            );
        }

        return pageItems;
    };

    return (
        <Pagination>
            <Pagination.First onClick={() => handlePageChange(0)} disabled={isFirstPage} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={isFirstPage} />

            {renderPageItems()}

            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={isLastPage} />
            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={isLastPage} />
        </Pagination>
    );
};

export default CustomPagination;
