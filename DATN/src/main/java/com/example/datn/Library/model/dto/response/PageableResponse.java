package com.example.datn.Library.model.dto.response;


import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
public class PageableResponse {

    long totalElements;
    int pageSize;
    int totalPages;
    int pageNumber;
    Object content;
}
