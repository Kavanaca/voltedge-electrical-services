package com.electrical.services.invoice;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentResponse(Long id, BigDecimal amount, String method,
                              LocalDate paymentDate, String reference) {}