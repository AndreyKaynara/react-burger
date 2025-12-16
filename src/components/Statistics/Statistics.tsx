import React, { FC } from 'react';
import styles from './Statistics.module.css';

interface StatisticsProps {
  total: number;
  totalToday: number;
  ready: number[];
  inProgress: number[];
}

const Statistics: FC<StatisticsProps> = ({ total, totalToday, ready, inProgress }) => {
  const readyColumns: number[][] = [];
  for (let i = 0; i < ready.length; i += 10) {
    readyColumns.push(ready.slice(i, i + 10));
  }

  const inProgressColumns: number[][] = [];
  for (let i = 0; i < inProgress.length; i += 10) {
    inProgressColumns.push(inProgress.slice(i, i + 10));
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text text_type_main-medium mb-6">Готовы:</h3>
        <div className={styles.statsContainer}>
          {readyColumns.map((column: number[], colIndex: number) => (
            <div key={colIndex} className={styles.statsColumn}>
              {column.map((number: number) => (
                <p key={number} className={`text text_type_digits-default ${styles.readyNumber}`}>
                  {number}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-15">
        <h3 className="text text_type_main-medium mb-6">В работе:</h3>
        <div className={styles.statsContainer}>
          {inProgressColumns.map((column: number[], colIndex: number) => (
            <div key={colIndex} className={styles.statsColumn}>
              {column.map((number: number) => (
                <p key={number} className="text text_type_digits-default">
                  {number}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text text_type_main-default mb-4">Выполнено за все время:</h3>
        <p className={`text text_type_digits-large glowText`}>{total.toLocaleString()}</p>
      </div>

      <div>
        <h3 className="text text_type_main-default mb-4">Выполнено за сегодня:</h3>
        <p className={`text text_type_digits-large glowText`}>{totalToday.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Statistics;
