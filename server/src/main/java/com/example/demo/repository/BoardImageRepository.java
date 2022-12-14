package com.example.demo.repository;

import com.example.demo.model.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
}
