package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.BoardTagMap;

@Repository
public interface BoardTagMapRepository extends  JpaRepository<BoardTagMap,Long>{
}
