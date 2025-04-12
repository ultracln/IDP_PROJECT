package com.mobylab.springbackend.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "book")
public class Book {
    @Id
    @GeneratedValue
    private UUID id;

    private String title;
    private String author;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Book setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getAuthor() {
        return author;
    }

    public Book setAuthor(String author) {
        this.author = author;
        return this;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }
}

