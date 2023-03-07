import moment from 'moment';

export const useMoment = () => {
  const fromNow = (date: string) => moment(date).fromNow()
  return {
    fromNow
  }
}