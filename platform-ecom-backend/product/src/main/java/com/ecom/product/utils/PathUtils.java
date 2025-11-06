package com.ecom.product.utils;

public class PathUtils {
     public static String constructImageUrl(String imageName,String imageBaseUrl) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }
}
