package com.example.datn.Library.model.dto.request.employee;


import com.example.datn.Library.model.enums.Gender;
import com.example.datn.Library.model.enums.Status;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
@NoArgsConstructor

@AllArgsConstructor
@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeFilterRequest {

    @Min(value = 1, message = "Page number must be greater than or equal to 1")
    Integer pageNo = 1;

    //@Min(value = 5, message = "Page Size must be greater than or equal to 5")
    Integer pageSize = 5;

    @Pattern(regexp = "createdAt|employeeName|birthDate", message = "Sort by must be 'employeeName', 'createdAt', or 'birthDate'")
    String sortBy = "createdAt";

    @Pattern(regexp = "asc|desc", message = "Sort direction must be 'asc' or 'desc'")
    String sortDir = "desc"; // "asc" or "desc"
    @Size(max = 50, message = "Maximum employee name length is 50 characters")
    String filterByEmployeeName;//EmployeeName
    Gender filterByGender;//MALE, FEMALE, OTHER (0, 1, 2)
    Status filterByStatus;//ACTIVE, INACTIVE (0, 1)

    @Pattern(regexp = "^$|^.{0,10}$", message = "Số điện thoại phải tối đa 10 ký tự hoặc rỗng")
    private String filterByPhoneNumber;

    @Min(value = 18, message = "Minimum age must be at least 18")
    Integer minAge;
    @Max(value = 100, message = "Maximum age must be at most 100")
    Integer maxAge;

    //toString all value of object
    @Override
    public String toString() {
        return "EmployeeFilterRequest{" +
                "pageNo=" + pageNo +
                ", pageSize=" + pageSize +
                ", sortBy='" + sortBy + '\'' +
                ", sortDir='" + sortDir + '\'' +
                ", filterByEmployeeName='" + filterByEmployeeName + '\'' +
                ", filterByGender=" + filterByGender + // Updated to handle Enum
                ", filterByStatus=" + filterByStatus + // Updated to handle Enum
                ", filterByPhoneNumber='" + filterByPhoneNumber + '\'' +
                ", minAge=" + minAge +
                ", maxAge=" + maxAge +
                '}';
    }

}
