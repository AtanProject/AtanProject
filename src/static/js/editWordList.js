        //変数系//
        //単語帳のリスト
        var listOfWordList = [
        	{
        		"ListName":"単語帳 part1",
        		"Id":"list1"
        	},
        	{
        		"ListName":"単語帳 part2",
        		"Id":"list2"
        	}
        ];
        
        //検索で受け取った単語リスト(テスト用の初期設定)
        var searchedWords = [
        	{
        		"Word":"first",
        		"Id":"word1",
        		"Meaning":"（はじめの単語の意味）",
        	},
        	{
        		"Word":"second",
        		"Id":"word2",
        		"Meaning":"（二番目の単語の意味）",
			}
        ];
        
        //選択された単語リスト(現在は借りに設定)
        var includedWordInListJSON = [
        	{
        		"Word":"X",
        		"Id":"word_X",
        		"Meaning":"XはXですよ",
        	},
        	{
        		"Word":"Y",
        		"Id":"word_Y",
        		"Meaning":"YはYですよ",
			}
        ];
        
        //選択されたリストのID
        var selectedListId = 0;;
        
		//読みこみ完了後に処理
        jQuery(function () {      
        	//単語帳リスト表示
        	//！！リスト取得API
        	for(var i = 0; i < listOfWordList.length; i++){
	            listElement = $('<li></li>').addClass('leftBoxL bgC3').attr('id', listOfWordList[i].Id).bind("click", {Id: listOfWordList[i].Id}, selectList);
        		listNameElement = $('<span></span>').attr('class','name').html(listOfWordList[i].ListName);
        		listNameEditButtonElement = $('<img>').attr('src','/img/pencil.gif').bind("click", {Id: listOfWordList[i].Id}, editListName);
   	            $('ul#ListOfWordList').append( listElement.append(listNameElement).append(listNameEditButtonElement) );
        	}
        	
          	//単語帳追加ボタンの動作登録          	
       		$('#addWordList').click(addList);

        	//リスト初期選択
        	$('li#' + listOfWordList[0].Id).trigger("click");
        	
        	//検索ボタンイベント登録
        	$('div#searchButton').click(function(){
        		qWord = $('input#searchQWord').val();
        		searchWord(qWord);
        	})
        });
        
        //単語帳関係//
        //単語帳選択
        function selectList(e){
        	id = e.data.Id;
        	//!!api呼び出し
        	
        		//表示書き換え 左メニュー
        		$('li#' + selectedListId).attr('Class','leftBoxL bgC3');
        		$('li#' + id).attr('Class','leftBoxL bgC2');
        		selectedListId = id;
        		
        		//!!表示書き換え　右メニュー
        		$('tbody#includedWord').empty();
	        	for(var i = 0; i < includedWordInListJSON.length; i++){
   					addWordUI(includedWordInListJSON[i], selectedListId);
	        	}
        }
        
        //単語帳リストの表示を作成
        function addList(){
        	//POSTでId発行してもらう
	   		$.post(
		    	"/api/makeWordList",
		    	null,
		    	function(data, status) {
		    		//結果反映
			    	id = data.ListId;
	        	    
   	            	//DOM作成して、フォーカスを当てる
		            $('ul#ListOfWordList').append(
        	    	$('<li></li>').addClass('leftBoxL bgC3').attr('id', id).bind("click", {Id: id}, selectList).append(
            				$('<input>').attr('type','text').attr('id',id).attr('name','text').attr('value','新しい単語帳')
						)
		            );
            		$('ul#ListOfWordList li#' + id).trigger("click");
					$('input#' + id).focus();
            	 	
            		//作成されたDOMにフォーカス切れでの動作を追加
            		$('input#' + id).bind("blur", {Id: id}, fixListName);
				},
				"json"
			);

        }     
        //リスト名編集モード
        function editListName(e){
	       	//現在値読み出し
	       	id = e.data.Id;
           	now = $('li#' + id).children('span.name').text();
            	
           	//編集モードへ
     		$('li#' + id).empty();
     		$('li#' + id).append($('<input>').attr('type','text').attr('id',id).attr('name','text').attr('value',now));
			$('input#' + id).focus();
				
			//フォーカス切れで確定動作
       	 	$('input#' + id).bind("blur", {Id: id}, fixListName);
        }
		//フォーカス解除時にテキスト固定する関数
		function fixListName(e){
			//現在値読み出し
	       	id = e.data.Id;
			newName = $('input#' + id).val();
           	 	
           	//editListAPI呼び出し
            	 		
           	//テキスト固定化
           	$('li#' + id).empty();
           	$('li#' + id).append($('<span></span>').attr('class','name').html(newName));
           	$('li#' + id).append(
           		$('<img>').attr('src','/img/pencil.gif').bind("click", {Id: id}, editListName)
           	);
		}

		//単語検索//
		function searchWord(qWord){
			//検索API呼び出し
			$.get(
				"api/searchWords",
				function(data){
					//API呼び出し結果を反映
					searchedWords = data

					tableElement = $('table#searchedWordList');
					tableElement.empty();

					for(var i = 0; i < searchedWords.length; i++){
						wordElement = $('<td></td>').html(searchedWords[i].Word);
						meanElement = $('<td></td>').html(searchedWords[i].Meaning);
						addButtonElement = $('<td></td>').attr('class','bgc1').attr('rowspan','2').html('add').bind("click", searchedWords[i], addWord);
						firstLine = $('<tr></tr>').append(wordElement).append(meanElement).append(addButtonElement);
					
						secondLine = $('<tr></tr>').attr('class','delimiterLine').append(
							$('<td></td>').attr('colspan','2').html('例文')
						);
					
						tableElement.append(firstLine);
						tableElement.append(secondLine);
	        		}
				}
			);				
		}

		//単語帳の中身//
        //単語の追加:引数は何番目の単語かを表す数値
        function addWord(e){
           	wordInfo = e.data;
        	//追加API呼び出し

			//API呼び出しが通ったら
				//表示
				addWordUI(wordInfo, selectedListId);
        }
        //単語帳へ見た目上の追加
        function addWordUI(wordInfo, ListId){
       		wordElement = $('<td></td>').attr('class','left word').html(wordInfo.Word);
       		meanElement = $('<td></td>').attr('class','center').html(wordInfo.Meaning);
       		delButtonElement = $('<td></td>').attr('class','right bgc1 deleteBt').html('delete').bind("click", {Id:wordInfo.Id ,Word:wordInfo.Word , ListId:ListId}, deleteWord);
       		trElementBase = $('<tr></tr>').attr('calss','includedWordInList').attr('id', wordInfo.Id);
       		firstLineElement = trElementBase.append(wordElement).append(meanElement).append(delButtonElement);
       		secondLineElement = trElementBase.append( $('<td></td>').attr('colspan','3').attr('class','delimiterLine') );

			tbodyElement = $('tbody#includedWord');
       		tbodyElement.append(firstLineElement);
       		tbodyElement.append(secondLineElement);
        }
        //単語の削除動作
        function deleteWord(e){
        	id = e.data.Id;
        	word = e.data.Word;
        	listId = e.data.ListId;
	        if(window.confirm(word + 'を削除します/id:' + id)){
	        	//API呼び出し
	        		//成功したら
	        		$('tbody#includedWord tr#' + id).remove();
	        		
                //window.location.reload();
	        }
        }

        //ポップアップ
        function popUp(id, name, title){
            URI = 'editVocaListPopUp.html';
            URI = URI + '?id=' + id;
            URI = URI + '&name=' + name;
            window.alert(URI);
            subwin = open(URI, title);
        }