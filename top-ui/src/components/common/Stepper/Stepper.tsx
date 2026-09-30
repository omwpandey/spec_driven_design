import React from 'react';
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  Typography,
  Button,
} from '@mui/material';

interface StepItem {
  label: string;
  description?: string;
  content?: React.ReactNode;
  optional?: boolean;
}

interface StepperProps {
  steps: StepItem[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
  nextLabel?: string;
  backLabel?: string;
  completeLabel?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  onNext,
  onBack,
  onComplete,
  nextLabel = 'Next',
  backLabel = 'Back',
  completeLabel = 'Complete',
}) => {
  const isLastStep = activeStep === steps.length - 1;

  return (
    <Box>
      <MuiStepper
        activeStep={activeStep}
        orientation={orientation}
        sx={{
          '& .MuiStepIcon-root.Mui-active': { color: '#CC0000' },
          '& .MuiStepIcon-root.Mui-completed': { color: '#4CAF50' },
        }}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              optional={
                step.optional ? (
                  <Typography variant="caption" color="text.secondary">
                    Optional
                  </Typography>
                ) : undefined
              }
            >
              {step.label}
            </StepLabel>
            {orientation === 'vertical' && step.content && (
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {step.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {step.description}
                    </Typography>
                  )}
                  {step.content}
                </Box>
              </StepContent>
            )}
          </Step>
        ))}
      </MuiStepper>

      {/* Navigation Buttons */}
      {(onNext || onBack) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          {onBack && activeStep > 0 && (
            <Button variant="outlined" size="small" onClick={onBack}>
              {backLabel}
            </Button>
          )}
          {isLastStep ? (
            onComplete && (
              <Button variant="contained" size="small" color="primary" onClick={onComplete}>
                {completeLabel}
              </Button>
            )
          ) : (
            onNext && (
              <Button variant="contained" size="small" color="primary" onClick={onNext}>
                {nextLabel}
              </Button>
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default Stepper;
