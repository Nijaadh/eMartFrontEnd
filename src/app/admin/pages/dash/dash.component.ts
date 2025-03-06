import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AdminService } from '../../../services/admin.service';
import { UtilService } from '../../../services/util.service';

@Component({
    selector: 'app-dash',
    templateUrl: './dash.component.html',
    styleUrl: './dash.component.scss'
})
export class DashComponent implements OnInit {
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    userCounnt: any;
    itemCount: any;
    newGift: any;
    onProcessingGift: any;
    deliveredGift: any;
    totalIncome: any;
    totalIncome12Months: any[] = [];

    //-------chart---------
    basicData: any;
    basicOptions: any;

    //----pie chart--------
    data: any;
    options: any;

    //---------------Exchange rate---------------
    usdToLkrRate: number | null = null;
    errorMessage: string = '';
    date: string = '';

    constructor(
        private adminService: AdminService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private utilService: UtilService
    ) { }

    ngOnInit() {
        this.getItemCount();
        this.getUserCount();
        this.getDeliveredGift();
        this.getNewGiftCount();
        this.getOnprocessingGiftCount();
        this.getTotalIncome();
        this.getTotalIncomeMonths();

        this.utilService.getUsdToLkrRate().subscribe(data => {
            this.usdToLkrRate = data.rate;
            this.date = data.date;
        });



        this.items = [
            { label: 'GiftWave' },
            { label: 'Admin' },
            { label: 'Dashboard' }
        ];

        this.home = { icon: 'pi pi-slack', routerLink: '/admin/dash' };

        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            this.basicData = {
                labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                datasets: [
                    {
                        label: 'Current Year Monthly Sales',
                        data: this.totalIncome12Months,
                        backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                        borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                        borderWidth: 1
                    }
                ]
            };

            this.basicOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };  //close-bar-chart

            //---------pie-chart----------

            const documentStyle1 = getComputedStyle(document.documentElement);
            const textColor1 = documentStyle.getPropertyValue('--text-color');

            this.data = {
                labels: ['A', 'B', 'C', 'E', 'F'],
                datasets: [
                    {
                        data: [300, 50, 100, 150, 75],
                        backgroundColor: [documentStyle1.getPropertyValue('--blue-500'), documentStyle1.getPropertyValue('--yellow-500'), documentStyle1.getPropertyValue('--green-500')],
                        hoverBackgroundColor: [documentStyle1.getPropertyValue('--blue-400'), documentStyle1.getPropertyValue('--yellow-400'), documentStyle1.getPropertyValue('--green-400')]
                    }
                ]
            };


            this.options = {
                cutout: '60%',
                plugins: {
                    legend: {
                        labels: {
                            color: textColor1
                        }
                    }
                }
            };
        }

    }


    getUserCount() {
        this.adminService.getUserCount().subscribe(data => {
            this.userCounnt = data;
        });

    }
    getItemCount() {
        this.adminService.getItemCount().subscribe(data => {
            this.itemCount = data;
        });
    }
    getNewGiftCount() {
        this.adminService.getNewgiftCount().subscribe(data => {
            this.newGift = data;
        });
    }
    getOnprocessingGiftCount() {
        this.adminService.getAcceptedGiftCount().subscribe(data => {
            this.onProcessingGift = data;
        });
    }
    getDeliveredGift() {
        this.adminService.getDeliveredGiftCount().subscribe(data => {
            this.deliveredGift = data;
        });
    }
    getTotalIncome() {
        this.adminService.getTotalIncome().subscribe(data => {
            this.totalIncome = data;
        });
    }
    getTotalIncomeMonths() {
        this.adminService.getTotalIncomelast12Months().subscribe(data => {
            this.totalIncome12Months = data;  // Assign the data to the array
            // this.updateChart();  // Refresh the chart after data is loaded
        });
    }

    updateChart() {
        this.basicData.datasets[0].data = this.totalIncome12Months;
    }
}
