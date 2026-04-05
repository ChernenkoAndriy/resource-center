const cron = require('node-cron');
const loanRepository = require('../repositories/loanRepository');

class CronService {
    init() {
        cron.schedule('0 0 * * *', async () => {
            console.log('--- Запуск перевірки протермінованих книг ---');
            await this.updateOverdueLoans();
        });
    }

    async updateOverdueLoans() {
        try {
            const overdueLoans = await loanRepository.findOverdueLoans();

            if (overdueLoans.length === 0) return;

            const updatePromises = overdueLoans.map(loan => {
                loan.status = 'overdue';
                return loanRepository.save(loan);
            });

            await Promise.all(updatePromises);
            console.log(`Оновлено статус для ${overdueLoans.length} позик.`);

        } catch (error) {
            console.error('Помилка в Cron Job:', error);
        }
    }
}

module.exports = new CronService();