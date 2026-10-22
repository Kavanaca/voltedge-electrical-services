package com.electrical.services.document;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final long MAX_BYTES = 5L * 1024 * 1024;

    private final Path root;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String dir) throws IOException {
        this.root = Paths.get(dir).toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw bad("Please choose a file");
        }
        if (file.getSize() > MAX_BYTES) {
            throw bad("File is too large. Maximum size is 5 MB");
        }

        String original = cleanName(file.getOriginalFilename());
        String ext = extension(original);

        byte[] head = new byte[8];
        int read;
        try (InputStream in = file.getInputStream()) {
            read = in.readNBytes(head, 0, head.length);
        } catch (IOException e) {
            throw bad("Could not read the file");
        }

        String type = detect(head, read);
        if (type == null) {
            throw bad("Only PDF, JPG and PNG files are allowed");
        }
        boolean extOk = switch (type) {
            case "application/pdf" -> ext.equals("pdf");
            case "image/png" -> ext.equals("png");
            default -> ext.equals("jpg") || ext.equals("jpeg");
        };
        if (!extOk) {
            throw bad("The file extension does not match the file content");
        }

        String storedName = UUID.randomUUID() + "." + ext;
        Path target = root.resolve(storedName).normalize();
        if (!target.startsWith(root)) {
            throw bad("Invalid file name");
        }
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save the file");
        }
        return new StoredFile(storedName, original, type, file.getSize());
    }

    public Resource load(String storedName) {
        Path p = root.resolve(storedName).normalize();
        if (!p.startsWith(root) || !Files.isRegularFile(p)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
        }
        return new FileSystemResource(p);
    }

    public void delete(String storedName) {
        if (storedName == null) return;
        try {
            Path p = root.resolve(storedName).normalize();
            if (p.startsWith(root)) Files.deleteIfExists(p);
        } catch (IOException ignored) {
            // The database record is already updated, a leftover file is harmless.
        }
    }

    private String detect(byte[] h, int n) {
        if (n >= 4 && h[0] == '%' && h[1] == 'P' && h[2] == 'D' && h[3] == 'F') return "application/pdf";
        if (n >= 8 && (h[0] & 0xFF) == 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G') return "image/png";
        if (n >= 3 && (h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF) return "image/jpeg";
        return null;
    }

    private String extension(String name) {
        int dot = name.lastIndexOf('.');
        return dot < 0 ? "" : name.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private String cleanName(String name) {
        String n = name == null ? "file" : name;
        n = n.replace("\\", "/");
        n = n.substring(n.lastIndexOf('/') + 1);
        n = n.replaceAll("[^A-Za-z0-9._ -]", "_");
        if (n.length() > 150) n = n.substring(n.length() - 150);
        return n.isBlank() ? "file" : n;
    }

    private ResponseStatusException bad(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }
}