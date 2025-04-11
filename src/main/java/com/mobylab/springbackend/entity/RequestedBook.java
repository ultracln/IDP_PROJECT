//package com.mobylab.springbackend.entity;
//
//import jakarta.persistence.*;
//import java.util.UUID;
//
//@Entity
//@Table(name = "requested_book", schema = "project")
//public class RequestedBook {
//
//    @Id
//    @GeneratedValue
//    private UUID id;
//
//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "offer_id", nullable = false)
//    private Offer offer;
//
//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "book_id", nullable = false)
//    private Book book;
//
//    public UUID getId() {
//        return id;
//    }
//
//    public void setId(UUID id) {
//        this.id = id;
//    }
//
//    public Offer getOffer() {
//        return offer;
//    }
//
//    public void setOffer(Offer offer) {
//        this.offer = offer;
//    }
//
//    public Book getBook() {
//        return book;
//    }
//
//    public void setBook(Book book) {
//        this.book = book;
//    }
//}
