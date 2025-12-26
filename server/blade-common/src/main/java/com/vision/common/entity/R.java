package com.vision.common.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;

/**
 * 统一响应结果封装类
 * 遵循 SpringBlade 规范
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class R<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 状态码
     */
    private int code;

    /**
     * 是否成功
     */
    private boolean success;

    /**
     * 消息
     */
    private String msg;

    /**
     * 数据
     */
    private T data;

    /**
     * 成功响应
     */
    public static <T> R<T> success(T data) {
        return new R<>(200, true, "操作成功", data);
    }

    /**
     * 成功响应（无数据）
     */
    public static <T> R<T> success() {
        return new R<>(200, true, "操作成功", null);
    }

    /**
     * 成功响应（自定义消息）
     */
    public static <T> R<T> success(String msg, T data) {
        return new R<>(200, true, msg, data);
    }

    /**
     * 失败响应
     */
    public static <T> R<T> fail(String msg) {
        return new R<>(500, false, msg, null);
    }

    /**
     * 失败响应（自定义状态码）
     */
    public static <T> R<T> fail(int code, String msg) {
        return new R<>(code, false, msg, null);
    }

    /**
     * 未认证响应
     */
    public static <T> R<T> unauthorized(String msg) {
        return new R<>(401, false, msg, null);
    }

    /**
     * 禁止访问响应
     */
    public static <T> R<T> forbidden(String msg) {
        return new R<>(403, false, msg, null);
    }

    /**
     * 未找到响应
     */
    public static <T> R<T> notFound(String msg) {
        return new R<>(404, false, msg, null);
    }
}
