package com.mobylab.springbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "feedback", schema = "project")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String category;

    private String satisfaction;

    private boolean subscribe;

    @Column(length = 2000)
    private String message;

    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }

    public void setCategory(String category) { this.category = category; }

    public String getSatisfaction() { return satisfaction; }

    public void setSatisfaction(String satisfaction) { this.satisfaction = satisfaction; }

    public boolean isSubscribe() { return subscribe; }

    public void setSubscribe(boolean subscribe) { this.subscribe = subscribe; }

    public String getMessage() { return message; }

    public void setMessage(String message) { this.message = message; }
}
