import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface CartoonEyesProps {
  // Define props to control eye expression later
  // default: Neutral, watching cursor
  expression?: 'default' | 'disagreement' | 'agreement' | 'waiting';
}

const CartoonEyes: React.FC<CartoonEyesProps> = ({ expression = 'default' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Refs to get the position of the eyes for rotation calculation
  const leftEyeRef = React.useRef<HTMLDivElement>(null);
  const rightEyeRef = React.useRef<HTMLDivElement>(null);

  // State to store eye positions
  const [leftEyePosition, setLeftEyePosition] = useState({ x: 0, y: 0 });
  const [rightEyePosition, setRightEyePosition] = useState({ x: 0, y: 0 });

  // Spring animations for pupil rotation
  const [leftPupilSpring, apiLeft] = useSpring(() => ({ transform: 'rotate(0deg)' }));
  const [rightPupilSpring, apiRight] = useSpring(() => ({ transform: 'rotate(0deg)' }));

  const [isBlinking, setIsBlinking] = useState(false); // State to manage blink animation

  // Expression classes for animations and styling
  // Tailwind classes are applied for transforms to control eye shape and position
  const expressionClasses = {
    default: 'transform translate-y-0',
    disagreement: 'transform -translate-y-1 rotate-12', // Example: slightly raised and rotated for disapproval
    agreement: 'transform translate-y-1 scale-y-110', // Example: slightly lowered and wider for contentment
    waiting: 'transform scale-y-90', // Example: slightly squinting
  };

  const currentExpressionClass = expressionClasses[expression] || expressionClasses.default;

  // Pupil color based on expression
  const pupilColorClasses = {
    default: 'bg-black',
    disagreement: 'bg-red-500', // Red for disagreement/error
    agreement: 'bg-green-500', // Green for agreement/success
    // Using a more distinct color for waiting, maybe yellow or orange
    waiting: 'bg-yellow-500', // Yellow for waiting/thinking
  };
  const currentPupilColorClass = pupilColorClasses[expression] || pupilColorClasses.default;

  const pupilStyle: React.CSSProperties = {
    transition: 'transform 0.2s ease-out, background-color 0.4s ease-in-out', // Added transition for background-color
  };

  const eyeStyle: React.CSSProperties = {
    transition: 'transform 0.4s ease-in-out', // Increased transition duration for more visible animation
  };

  // Destructure focusedInputPosition from props
  const { focusedInputPosition = null } = ({ focusedInputPosition: null, expression });

  // Handle mouse movement to track cursor
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    console.log('Mouse Position:', { x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);
  


  // Effect to update eye positions after render and on resize
  useEffect(() => {
    const updateEyePositions = () => {
      if (leftEyeRef.current) {
        const rect = leftEyeRef.current.getBoundingClientRect();
        setLeftEyePosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
      if (rightEyeRef.current) {
        const rect = rightEyeRef.current.getBoundingClientRect();
        console.log('Right Eye Position set:', { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setRightEyePosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };

    updateEyePositions();
    window.addEventListener('resize', updateEyePositions);

    return () => {
      window.removeEventListener('resize', updateEyePositions);
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render

  // Effect to update spring animations when mouse position or eye positions change
  // Also handles pupil rolling when an input is focused

  useEffect(() => {
      let targetX, targetY;
      if (focusedInputPosition) {
        targetX = focusedInputPosition.x;
        targetY = focusedInputPosition.y;
      } else {
        targetX = mousePosition.x;
        targetY = mousePosition.y;
      }

      const calculateRotation = (eyeX: number, eyeY: number, targetX: number, targetY: number) => {
        const dx = targetX - eyeX;
        const dy = targetY - eyeY;
        console.log('dx:', dx, 'dy:', dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        console.log('Calculated angle:', angle);
        const transformValue = `rotate(${angle}deg)`;
        console.log('Transform value:', transformValue);
        return transformValue;
      };
      // Only start animations if eye positions have been updated
      console.log('Checking condition:', leftEyePosition.x > 0 && rightEyePosition.x > 0);
      if (leftEyePosition.x > 0 && rightEyePosition.x > 0) {
        apiLeft.start({ transform: calculateRotation(leftEyePosition.x, leftEyePosition.y, targetX, targetY) });
        apiRight.start({ transform: calculateRotation(rightEyePosition.x, rightEyePosition.y, targetX, targetY) });
      }
    }
    //updatePupilRotation()
   , [mousePosition, leftEyePosition, rightEyePosition, apiLeft, apiRight, focusedInputPosition]); // Added focusedInputPosition to dependencies

  // Effect to trigger blinking when an input becomes focused
  useEffect(() => {
    if (focusedInputPosition !== null) {
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 500); // Blink for 500ms
      return () => clearTimeout(timer);
    }
  }, [focusedInputPosition]);

  // Calculate rotation for the pupil to follow the mouse
  const Eye: React.FC<{ ref: React.RefObject<HTMLDivElement>; animatedStyle: any; }> = ({ ref, animatedStyle }) => (
 <div

      ref={ref}
      className={`relative w-16 h-16 bg-white rounded-full flex justify-center items-center overflow-hidden border-2 border-black ${currentExpressionClass} animate-blink`} // Added border, expression class, and animate-blink
 style={{ ...eyeStyle, animation: isBlinking ? 'blink 0.2s ease-in-out' : 'none' }}> {/* Apply blink animation */}
 <animated.div className={`w-8 h-8 rounded-full ${currentPupilColorClass}`} style={{ ...animatedStyle, ...pupilStyle }} /> {/* Adjusted pupil size and added dynamic color and pupilStyle */}
    </div>
  );

  return (
 <div className="flex justify-center items-center space-x-4 relative"> {/* Relative for absolute positioning of eyelashes */}
 {/* Left Eye */}
 <Eye ref={leftEyeRef} animatedStyle={leftPupilSpring} />
      {/* Right Eye */}
      <Eye ref={rightEyeRef} animatedStyle={rightPupilSpring} />
    </div>
  );
};
export default CartoonEyes;
