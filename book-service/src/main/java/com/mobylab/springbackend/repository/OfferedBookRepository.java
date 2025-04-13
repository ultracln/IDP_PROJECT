package com.mobylab.springbackend.repository;

import com.mobylab.springbackend.entity.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfferedBookRepository extends JpaRepository<OfferedBook, UUID> {

    List<OfferedBook> findByOfferId(UUID offerId);

    List<OfferedBook> findByBookId(UUID bookId);

    List<OfferedBook> findByIsRequested(boolean isRequested);
    @Query("SELECT ob FROM OfferedBook ob WHERE ob.book.ownerId = :ownerId")
    List<OfferedBook> findAllByBookOwner(@Param("ownerId") UUID ownerId);
}