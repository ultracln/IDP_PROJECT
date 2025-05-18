package com.mobylab.springbackend.service;

import com.mobylab.springbackend.service.dto.FeedbackRequestDTO;
import com.mobylab.springbackend.service.dto.FeedbackResponseDTO;
import com.mobylab.springbackend.entity.Feedback;
import com.mobylab.springbackend.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public FeedbackResponseDTO saveFeedback(FeedbackRequestDTO feedbackDTO) {
        Feedback feedback = new Feedback();
        feedback.setTitle(feedbackDTO.getTitle());
        feedback.setCategory(feedbackDTO.getCategory());
        feedback.setSatisfaction(feedbackDTO.getSatisfaction());
        feedback.setSubscribe(feedbackDTO.isSubscribe());
        feedback.setMessage(feedbackDTO.getMessage());
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return convertToResponseDTO(savedFeedback);
    }

    public List<FeedbackResponseDTO> getAllFeedback() {
        return feedbackRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<FeedbackResponseDTO> getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    private FeedbackResponseDTO convertToResponseDTO(Feedback feedback) {
        FeedbackResponseDTO dto = new FeedbackResponseDTO();
        dto.setId(feedback.getId());
        dto.setTitle(feedback.getTitle());
        dto.setCategory(feedback.getCategory());
        dto.setSatisfaction(feedback.getSatisfaction());
        dto.setSubscribe(feedback.isSubscribe());
        dto.setMessage(feedback.getMessage());
        return dto;
    }
} 