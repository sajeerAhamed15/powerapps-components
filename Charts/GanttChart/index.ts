import { IInputs, IOutputs } from "./generated/ManifestTypes";
import Gantt = require("frappe-gantt")

export class GanttChart2 implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private mainContainer: HTMLDivElement;
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
	{	
		this.mainContainer = document.createElement("div");
		// this.mainContainer.style.pointerEvents = "all";
		this.mainContainer.style.display = "grid";
		this.mainContainer.className = "gantt-root-1"

		var tasks: Gantt.Task[] = [
			{
				id: 'Task 1',
				name: 'Default Task 1',
				start: '2016-12-5',
				end: '2016-12-10',
				progress: 20,
				dependencies: "",
				custom_class: 'bar-milestone'
			},
			{
				id: 'Task 2',
				name: 'Default Task 1',
				start: '2016-12-7',
				end: '2016-12-12',
				progress: 20,
				dependencies: "Task 1",
				custom_class: 'bar-milestone'
			}
		]

		var gantt = new (Gantt as any).default(this.mainContainer, tasks);


		container.appendChild(this.mainContainer);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if (context.parameters.ChartData.columns.length < 5) return;
		const recordIds = context.parameters.ChartData.sortedRecordIds;

		const tasks: Gantt.Task[] = []
		recordIds.forEach(recordId => {
			tasks.push({
				id: context.parameters.ChartData.records[recordId].getFormattedValue("id"),
				name: context.parameters.ChartData.records[recordId].getFormattedValue("name"),
				start: context.parameters.ChartData.records[recordId].getFormattedValue("start"),
				end: context.parameters.ChartData.records[recordId].getFormattedValue("end"),
				progress: parseInt(context.parameters.ChartData.records[recordId].getFormattedValue("progress")),
				dependencies: context.parameters.ChartData.records[recordId].getFormattedValue("dependencies"),
			})
		});
		
		var gantt = new (Gantt as any).default(this.mainContainer, tasks);
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}
