import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

const GameBoard = () => {
  const positions = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
    { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 },
    { x: 1, y: 3 }, { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 },
  ];

  const userPosition = 5; // Example position
  const otherUsers = [
    { id: 1, position: 2, color: 'bg-blue-500' },
    { id: 2, position: 8, color: 'bg-purple-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 card skill-board"
    >
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {positions.map((pos, index) => {
          const isUserHere = index === userPosition;
          const otherUser = otherUsers.find(u => u.position === index);

          return (
            <motion.div
              key={index}
              className="aspect-square relative glass rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              {index % 3 === 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </motion.div>
              )}

              {isUserHere && (
                <motion.div
                  layoutId="player"
                  className="absolute inset-2 bg-primary-500 rounded-lg flex items-center justify-center"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Star className="w-6 h-6 text-white" />
                </motion.div>
              )}

              {otherUser && (
                <motion.div
                  layoutId={`player-${otherUser.id}`}
                  className={`absolute inset-2 ${otherUser.color} rounded-lg opacity-50`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GameBoard;