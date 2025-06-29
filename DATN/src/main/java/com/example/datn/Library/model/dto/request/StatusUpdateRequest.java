package com.example.datn.Library.model.dto.request;


import com.example.datn.Library.model.enums.Status;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class StatusUpdateRequest {
    @NotNull(message = "Trạng thái không là bằng null")
    Status status;
}
