package com.example.datn.Library.model.dto.request.customer;


import com.example.datn.Library.model.enums.Status;
import com.example.datn.Library.validation.EnumSubset;
import jakarta.validation.constraints.Min;
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
@ToString(callSuper = true)
public class CustomerUpdateRequest  extends CustomerCreateRequest {
    @NotNull(message = "ID không được để trống")
    @Min(value = 1, message = "ID phải lớn hơn 0")
    Long id;//TODO: Update.

    @NotNull(message = "Trạng thái không được để trống")
    @EnumSubset(enumClass = Status.class, anyOf = {"ACTIVE", "INACTIVE"})
    String status;
}
