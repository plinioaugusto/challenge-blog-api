//PADRONIZANDO DATAS NO BANCO
function formatarDataBR(data) {
	if (data == null || data == "null") {
		return "";
	}

	if (typeof(data)) {
		data = new Date(data);
	}
	
	if (data == "Invalid Date") {
		return "(Data Inválida)";
	} else {
		data = data.toLocaleString();

		var fim = data.lastIndexOf(":");
		return data.substring(0, fim);
	}
}