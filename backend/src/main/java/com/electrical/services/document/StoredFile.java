package com.electrical.services.document;

public record StoredFile(String storedName, String originalName, String contentType, long size) {}