import React from 'react';
import { TeamElementInterface } from '../../team-logic/team-static';

export interface TeamElementProps {
  teamElement: TeamElementInterface;
  onClick?: () => void;
}

const TeamElement: React.FC<TeamElementProps> = ({ teamElement, onClick }) => {
  return (
    <div
      className="team-element"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick && onClick();
        }
      }}
    >
      {teamElement.getName()}
    </div>
  );
};

export default TeamElement;
