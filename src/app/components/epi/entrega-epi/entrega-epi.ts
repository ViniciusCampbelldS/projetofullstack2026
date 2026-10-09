import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryItem, EpiOption } from '../epi.models';
import { EpiService } from '../../../services/epi.service';
import { ConfirmarEntregaModal } from '../../../modals/entrega-epi/confirmar-entrega-modal/confirmar-entrega-modal';
import { DeliveryItemsReview } from '../../../modals/entrega-epi/delivery-items-review/delivery-items-review';
import { FuncionarioStatus, FuncionarioStatusFiltro } from '../../../models/funcionario';
import { FuncionarioService } from '../../../services/funcionario.service';

interface EmployeeOption {
	nome: string;
	cpf: string;
	status: FuncionarioStatus;
}

@Component({
	selector: 'app-entrega-epi',
	standalone: true,
	imports: [CommonModule, FormsModule, ConfirmarEntregaModal, DeliveryItemsReview],
	templateUrl: './entrega-epi.html',
	styleUrls: ['./entrega-epi.scss'],
})
export class EntregaEpi implements OnInit {
	employeeOptions: EmployeeOption[] = [];
	carregandoFuncionarios = false;
	erroFuncionarios = '';

	availableEpis: EpiOption[];
	deliveryItems: DeliveryItem[];
	showReplacedEpiSection = false;
	showConfirmarEntregaModal = false;
	showEmployeeSuggestions = false;
	showEpiSuggestions = false;
	showReplacedEpiSuggestions = false;
	selectedEmployee = '';
	deliveryDate = this.getTodayDate();
	employeeCpf = '';
	epiSearch = '';
	replacedEpiSearch = '';
	replacedEpiName = '';
	replacedEpiCa = '';
	replacedEpiValidity = '';
	selectedFichaName = '';
	fichaPreviewUrl = '';
	deliverySaved = false;

	constructor(private readonly epiService: EpiService, private readonly funcionarioService: FuncionarioService) {
		this.availableEpis = this.epiService.getAvailableEpis();
		this.deliveryItems = this.epiService.getDeliveryDraft().map((item) => ({
			...item,
			quantity: 1,
		}));
		this.epiSearch = this.deliveryItemLabel(this.deliveryItems[0]);
	}

	ngOnInit(): void {
		this.carregarFuncionarios();
	}

	private carregarFuncionarios(): void {
		this.carregandoFuncionarios = true;
		this.erroFuncionarios = '';

		this.funcionarioService.listar().subscribe({
			next: (funcionarios) => {
				this.employeeOptions = funcionarios.map((funcionario) => ({
					nome: funcionario.nome,
					cpf: funcionario.cpf,
					status: this.statusParaTela(funcionario.status),
				}));

				const funcionarioInicial =
					this.employeeOptions.find((funcionario) => funcionario.status !== 'Inativo') ??
					this.employeeOptions[0];

				if (funcionarioInicial) {
					this.selectEmployee(funcionarioInicial);
				}

				this.carregandoFuncionarios = false;
			},
			error: (erro) => {
				console.error('Erro ao carregar funcionários para entrega de EPI:', erro);
				this.employeeOptions = [];
				this.selectedEmployee = '';
				this.employeeCpf = '';
				this.erroFuncionarios = 'Não foi possível carregar os funcionários.';
				this.carregandoFuncionarios = false;
			},
		});
	}

	private statusParaTela(status: string): FuncionarioStatus {
		switch (status) {
			case 'Af':
				return 'Afastado';
			case 'In':
				return 'Inativo';
			default:
				return 'Ativo';
		}
	}

	// Filtro de situação do funcionário.
	// 'Todos' deixa qualquer funcionário aparecer.
	// 'Ativos e Afastados' oculta apenas os inativos.
	filtroStatusFuncionario: FuncionarioStatusFiltro =
		'Ativos e Afastados';

	get filteredEmployeeOptions(): EmployeeOption[] {
		const termo = this.normalizeText(this.selectedEmployee);

		return this.employeeOptions.filter((employee) => {
			// 1. Verifica correspondência de texto (Nome ou CPF) de forma normalizada
			const correspondeTexto = !termo ||
				this.normalizeText(employee.nome).includes(termo) ||
				this.normalizeText(employee.cpf).includes(termo);

			// 2. Verifica a situação selecionada (Filtro de Status)
			const correspondeStatus =
				this.filtroStatusFuncionario === 'Todos' ||
				(this.filtroStatusFuncionario === 'Ativos e Afastados' && employee.status !== 'Inativo') ||
				employee.status === this.filtroStatusFuncionario;

			// Retorna apenas se satisfazer ambas as condições
			return correspondeTexto && correspondeStatus;
		});
	}

	get filteredEpiOptions(): EpiOption[] {
		return this.filterEpis(this.epiSearch);
	}

	get filteredReplacedEpiOptions(): EpiOption[] {
		return this.filterEpis(this.replacedEpiSearch);
	}

	addDeliveryItem(): void {
		const fallback = this.availableEpis[0];
		this.deliveryItems.push({
			epi: fallback.name,
			ca: fallback.ca,
			quantity: 1,
			validity: fallback.validity,
		});
	}

	removeDeliveryItem(index: number): void {
		if (this.deliveryItems.length === 1) {
			return;
		}

		if (!window.confirm('Deseja remover esse item?')) {
			return;
		}

		this.deliveryItems.splice(index, 1);
	}

	onEmployeeFocus(): void {
		this.showEmployeeSuggestions = true;
	}

	onEmployeeInput(): void {
		this.showEmployeeSuggestions = true;
		const exactMatch = this.employeeOptions.find(
			(employee) => this.normalizeText(this.employeeLabel(employee)) === this.normalizeText(this.selectedEmployee),
		);

		if (exactMatch) {
			this.employeeCpf = exactMatch.cpf;
			this.selectedEmployee = this.employeeLabel(exactMatch);
			return;
		}

		this.employeeCpf = '';
	}

	selectEmployee(employee: EmployeeOption): void {
		this.selectedEmployee = this.employeeLabel(employee);
		this.employeeCpf = employee.cpf;
		this.showEmployeeSuggestions = false;
	}

	hideEmployeeSuggestions(): void {
		this.showEmployeeSuggestions = false;
	}

	onEpiFocus(): void {
		this.showEpiSuggestions = true;
	}

	onEpiInput(): void {
		this.showEpiSuggestions = true;
		this.applyEpiSearch(this.epiSearch, false);
	}

	selectEpi(epi: EpiOption): void {
		this.applyEpiSelection(epi);
		this.showEpiSuggestions = false;
	}

	hideEpiSuggestions(): void {
		this.showEpiSuggestions = false;
	}

	onReplacedEpiFocus(): void {
		this.showReplacedEpiSuggestions = true;
	}

	onReplacedEpiInput(): void {
		this.showReplacedEpiSuggestions = true;
		this.applyEpiSearch(this.replacedEpiSearch, true);
	}

	selectReplacedEpi(epi: EpiOption): void {
		this.replacedEpiSearch = this.epiLabel(epi);
		this.replacedEpiName = epi.name;
		this.replacedEpiCa = epi.ca;
		this.replacedEpiValidity = epi.validity;
		this.showReplacedEpiSuggestions = false;
	}

	hideReplacedEpiSuggestions(): void {
		this.showReplacedEpiSuggestions = false;
	}

	onFichaUpload(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) {
			return;
		}

		this.selectedFichaName = file.name;
		this.fichaPreviewUrl = URL.createObjectURL(file);
	}

	revealReplacedEpiSection(): void {
		this.showReplacedEpiSection = true;
	}

	registerDelivery(): void {
		this.showConfirmarEntregaModal = true;
	}

	onConfirmDelivery(): void {
		this.deliverySaved = true;
		this.showConfirmarEntregaModal = false;
	}

	@HostListener('document:pointerdown', ['$event'])
	closeSuggestionsOnOutsideClick(event: PointerEvent): void {
		const target = event.target as HTMLElement | null;
		if (target?.closest('.employee-select')) {
			return;
		}

		this.showEmployeeSuggestions = false;
		this.showEpiSuggestions = false;
		this.showReplacedEpiSuggestions = false;
	}

	private applyEpiSearch(value: string, replaced: boolean): void {
		const exactMatch = this.availableEpis.find(
			(epi) => this.normalizeText(this.epiLabel(epi)) === this.normalizeText(value),
		);

		if (!exactMatch) {
			return;
		}

		if (replaced) {
			this.selectReplacedEpi(exactMatch);
			return;
		}

		this.applyEpiSelection(exactMatch);
	}

	private applyEpiSelection(epi: EpiOption): void {
		const item = this.deliveryItems[0];
		item.epi = epi.name;
		item.ca = epi.ca;
		item.validity = epi.validity;
		item.quantity = 1;
		this.epiSearch = this.epiLabel(epi);
	}

	private filterEpis(value: string): EpiOption[] {
		const termo = this.normalizeText(value);
		return this.availableEpis.filter((epi) => {
			if (!termo) {
				return true;
			}

			return this.normalizeText(this.epiLabel(epi)).includes(termo);
		});
	}

	private employeeLabel(employee: EmployeeOption): string {
		return `${employee.nome} — ${employee.cpf}`;
	}

	private epiLabel(epi: Pick<EpiOption, 'name' | 'ca'>): string {
		return `${epi.name} — ${epi.ca}`;
	}

	private deliveryItemLabel(item: Pick<DeliveryItem, 'epi' | 'ca'>): string {
		return `${item.epi} — ${item.ca}`;
	}

	private getTodayDate(): string {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	private normalizeText(value: string): string {
		return value
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim();
	}
}
