package com.mobylab.springbackend.service.dto;

public class BookWithOwnerDto {
    private String title;
    private String author;
    private String ownerEmail;

    public String getTitle() { return title; }
    public BookWithOwnerDto setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getAuthor() { return author; }
    public BookWithOwnerDto setAuthor(String author) {
        this.author = author;
        return this;
    }

    public String getOwnerEmail() { return ownerEmail; }
    public BookWithOwnerDto setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
        return this;
    }
}
