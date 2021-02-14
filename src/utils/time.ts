import dayjs from 'dayjs'

const convertTimeWithUTC = (time: string | Date) => dayjs(time).add(9, 'hours').toDate()

const currentTime = () => dayjs().add(9, 'hours').toDate()

const getFirstDateOfWeek = (date: Date) =>
  dayjs(date).startOf('week').add(9, 'hours').add(1, 'day').toDate()

const getLastDateOfWeek = (date: Date) =>
  dayjs(date).endOf('week').add(9, 'hours').add(1, 'day').toDate()

const getDayOfDate = (time: Date) => dayjs(time).format('ddd')

export default {
  convertTimeWithUTC,
  currentTime,
  getFirstDateOfWeek,
  getLastDateOfWeek,
  getDayOfDate,
}
