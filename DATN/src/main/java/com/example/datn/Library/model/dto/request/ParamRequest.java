package com.example.datn.Library.model.dto.request;


import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ParamRequest {
     Integer pageNo = 1;
     Integer pageSize = 10;

     String sortBy = "createdAt";
     String sortDir = "desc"; // "asc" or "desc"

}
