package com.example.datn.Library.exception;

import com.example.datn.Library.model.dto.response.exception.ErrorResponse;
import com.example.datn.Library.service.impl.EmployeeServiceImpl;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(DuplicateFieldException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleDuplicateFieldException(DuplicateFieldException ex, WebRequest request) {
        logger.info("============== handleDuplicateFieldException ==============");
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value()) // 409
                .error(HttpStatus.CONFLICT.getReasonPhrase()) // "Conflict"
                .path(request.getDescription(false).replace("uri=", ""))
                .message(ex.getMessage())
                .build();
    }

    /**
     * Được ném ra khi validation thất bại cho các tham số phương thức được đánh dấu bằng @Valid
     * Thường sử dụng với các đối tượng DTO (Data Transfer Objects)
     * Áp dụng cho các method parameters trong Controller : Validate nguyên đối tượng
     * Vd : @PostMapping(@Valid @RequestBody UserDto userDto)
     *
     * @param ex Ngoại lệ MethodArgumentNotValidException chứa thông tin về lỗi xác thực (Validation Error).
     * @param request Đối tượng WebRequest cung cấp thông tin về yêu cầu HTTP hiện tại.
     * @return Một đối tượng ErrorResponse chứa thông tin lỗi được tạo ra từ ngoại lệ.
     */
    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        logger.info("============== handleValidationException ==============");
        String errorMessage = ExceptionMessageFormatter.formatValidationMessage(ex);
        ErrorResponse errorResponse = createErrorResponse(ex, request);
//        errorResponse.setMessage(errorMessage);
        return errorResponse;
    }

    /**
     * Được ném ra khi validation thất bại cho các tham số phương thức được đánh dấu bằng @Validated
     * Thường sử dụng với việc validation các tham số đầu vào phương thức (method parameters)
     * Phạm Vi : Có thể sử dụng ở Service, Component
     * Cách Áp Dụng : Validate từng tham số
     * Vd:
     * @Validated
     * public class UserService {
     *     public void createUser(
     *         @NotNull(message = "ID không được null") Long id,
     *         @Email(message = "Email không hợp lệ") String email,
     *         @Size(min = 2, max = 50, message = "Tên phải từ 2-50 ký tự") String name
     *     ){
     *          // Nếu bất kỳ tham số nào vi phạm ràng buộc,
     *         // ConstraintViolationException sẽ được ném ra};
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolationException(ConstraintViolationException ex, WebRequest request) {
        logger.info("============== handleConstraintViolationException ==============");
        String errorMessage = ExceptionMessageFormatter.formatConstraintViolationMessage(ex);

        ErrorResponse errorResponse = createErrorResponse(ex, request);
//        errorResponse.setMessage(errorMessage);

        return errorResponse;
    }

    /**
     * Khi tham số yêu cầu trong yêu cầu HTTP bị thiếu.
     * Các tham số liên quan : Tham số yêu cầu trong query string, URL path, hoặc form data.
     *Lý do ném ngoại lệ	Tham số bắt buộc không có trong yêu cầu từ client
     * Vd:
     * Thiếu tham số trong query string, ví dụ: GET /products/search?name=Apple.
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMissingServletRequestParameterException(MissingServletRequestParameterException ex, WebRequest request) {
        logger.info("============== handleMissingServletRequestParameterException ==============");
        return createErrorResponse(ex, request);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception ex, WebRequest request) {
        logger.info("============== handleException ==============");
        return createErrorResponse(ex, request);
    }

    /*
        ex: Đại diện cho ngoại lệ (exception) được ném ra, chứa thông tin về lỗi cụ thể.
                vd: chẳng hạn như thông điệp lỗi (ex.getMessage()).
        request (WebRequest): Đại diện cho thông tin về yêu cầu HTTP (request) gây ra lỗi.
                vd: cung cấp chi tiết như đường dẫn URI (request.getDescription(false)).
     */
    private ErrorResponse createErrorResponse(Exception ex, WebRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())//400
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())//"Bad Request"
                .path(request.getDescription(false).replace("uri=", ""))// uri=/api/users --> /api/users
                .message(ex.getMessage())
                .build();
    }

    /*
        HttpMessageNotReadableException:
            JSON trong body không hợp lệ (ví dụ: cú pháp sai, thiếu dấu ngoặc, định dạng không đúng).
            Giá trị không thể ánh xạ vào kiểu dữ liệu mong muốn:
            pageNo, pageSize, minAge, maxAge: Gửi chuỗi hoặc giá trị không phải số (ví dụ: "abc" thay vì 1).
            filterByGender, filterByStatus: Gửi giá trị không thuộc Enum (ví dụ: "INVALID_GENDER" thay vì "MALE", "FEMALE", hoặc "OTHER").

         MethodArgumentTypeMismatchException:
            Nguyên nhân: Giá trị trong URL path không thể chuyển đổi sang kiểu dữ liệu mong muốn (ví dụ: pageNo hoặc minAge là "invalid" thay vì số).
     */

}
