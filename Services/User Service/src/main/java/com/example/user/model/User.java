package com.example.user.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;


@Setter
@Data
@Entity
@Table(name = "users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;


    @Column(unique = true, nullable = false)
    private String username;

    public User() {
    }

    public User(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                '}';
    }
}