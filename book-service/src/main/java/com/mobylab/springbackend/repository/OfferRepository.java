package com.mobylab.springbackend.repository;

import com.mobylab.springbackend.entity.Offer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfferRepository extends JpaRepository<Offer, UUID> {

    @Override
    @EntityGraph(attributePaths = {"offeredBooks", "offeredBooks.book"})
    List<Offer> findAll();

    @EntityGraph(attributePaths = {"offeredBooks", "offeredBooks.book"})
    Optional<Offer> findById(UUID id);

    @Query("SELECT o FROM Offer o JOIN o.offeredBooks ob WHERE ob.book.id = :bookId AND ob.isRequested = false")
    List<Offer> findAllByOfferedBook(@Param("bookId") UUID bookId);

    @Query("SELECT o FROM Offer o JOIN o.offeredBooks ob WHERE ob.book.id = :bookId AND ob.isRequested = true")
    List<Offer> findAllByRequestedBook(@Param("bookId") UUID bookId);

    @Query("SELECT o FROM Offer o JOIN o.offeredBooks ob WHERE ob.book.id = :bookId")
    List<Offer> findAllByBook(@Param("bookId") UUID bookId);
}