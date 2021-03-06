(function($) {
    // Widgets page
    if( $('body.widgets-php').length ) {
        // Hide download select if user ones show download page of current one
        $('[class*="cmb2-id-widget-edd-ajax-filters-"] input[name$="[show_label]').each(function() {
            if( ! $(this).prop('checked') ) {
                $(this).closest('.cmb-row').next().css({ display: 'none' });
            }
        });

        // Event on widget added/updated
        $(document).on('widget-updated widget-added', function() {
            $('[class*="cmb2-id-widget-edd-ajax-filters-"] input[name$="[show_label]').each(function() {
                if( ! $(this).prop('checked') ) {
                    $(this).closest('.cmb-row').next().css({ display: 'none' });
                }
            });
        });

        // Event on change radio group
        $('body').on('change.eddAjaxFilters', 'input[name$="[show_label]"]', function() {
            var target = $(this).closest('.cmb-row').next();

            if( $(this).prop('checked') ) {
                target.slideDown('fast');
            } else {
                target.slideUp('fast');
            }
        });
    }

    // Ajax filters options
    if( $('.cmb2-options-page.edd-ajax-filters').length ) {
        // Shortcode generator
        $('#shortcode_form_filter').on('change', function() {
            var filter = $(this).val();

            // Types select options based on filter
            var new_types = {};

            switch( filter ) {
                case 'button':
                case 'order':
                    new_types = {
                        'button': 'Button',
                        'block': 'Block'
                    };
                    break;
                case 'input':
                    new_types = {
                        'text': 'Text',
                        'textarea': 'Textarea',
                        'search': 'Search'
                    };
                    break;
                case 'options':
                case 'taxonomy':
                    new_types = {
                        'select': 'Select',
                        'block': 'Block',
                        'list': 'List'
                    };
                    break;
            }

            // Update types select
            var types_select = $('#shortcode_form_type');
            types_select.html('');
            $(Object.keys(new_types)).each(function (index, key) {
                types_select.append('<option value="' + key + '">' + new_types[key] + '</option>');
            });

            // Field input type and options based on filter
            var new_field = {};

            switch( filter ) {
                case 'button':
                    new_field = {
                        'type': 'hidden'
                    };
                    break;
                case 'order':
                    new_field = {
                        'type': 'select',
                        'options': {
                            'post_title': 'Title',
                            'post_date': 'Date',
                            'edd_price': 'Price',
                            '_edd_download_sales': 'Sales',
                            'comment_count': 'Comments'
                        }
                    };
                    break;
                case 'input':
                    new_field = {
                        'type': 'multicheck',
                        'options': {
                            'post_title': 'Title',
                            'post_excerpt': 'Excerpt',
                            'post_content': 'Content',
                        }
                    };
                    break;
                case 'options':
                    new_field = {
                        'type': 'text'
                    };
                    break;
                case 'taxonomy':
                    new_field = {
                        'type': 'select',
                        'options': {
                            'download_category': 'Download Categories',
                            'download_tag': 'Download Tags'
                        }
                    };
                    break;
            }

            // Update field input
            var field_container = $('#shortcode_form_field_text').parent();
            $('#shortcode_form_field_text').remove();

            if( new_field['type'] === 'hidden' || new_field['type'] === 'text' ) {
                field_container.append('<input id="shortcode_form_field_text" data-shortcode-attr="field" data-clear-if-empty="true" type="' + new_field['type'] + '" />');
            } else if( new_field['type'] === 'select' ) {
                var options_html = '';

                $(Object.keys(new_field['options'])).each(function (index, key) {
                    options_html += '<option value="' + key + '">' + new_field['options'][key] + '</option>';
                });

                field_container.append('<select id="shortcode_form_field_text" data-shortcode-attr="field">' + options_html + '</select>');
            } else if( new_field['type'] === 'multicheck' ) {
                var checkboxes_html = '';

                $(Object.keys(new_field['options'])).each(function (index, key) {
                    checkboxes_html += '<li><label><input type="checkbox" value="' + key + '">' + new_field['options'][key] + '</label></li>';
                });

                field_container.append('<ul id="shortcode_form_field_text" data-shortcode-attr="field" data-clear-if-empty="true" class="cmb2-checkbox-list cmb2-list">' + checkboxes_html + '</ul>');
            }



            // Toggle inputs visibility based on data-hidden-for and data-visible-for attribute
            var rows_to_hide = $('#edd-ajax-filters-shortcode-form').find(
                '*[data-hidden-for^="' + filter + ',"], '       // starts by filter,
                + '*[data-hidden-for*=",' + filter + ',"], '    // contains ,filter,
                + '*[data-hidden-for$=",' + filter + '"], '     // ends by ,filter
                + '*[data-hidden-for="' + filter + '"], '       // equals filter
                + '*[data-visible-for]'
                    + ':not([data-visible-for^="' + filter + ',"])'
                    + ':not([data-visible-for*=",' + filter + ',"])'
                    + ':not([data-visible-for$=",' + filter + '"])'
                    + ':not([data-visible-for="' + filter + '"])'
            );
            var rows_to_show = $('#edd-ajax-filters-shortcode-form').find(
                '*[data-visible-for^="' + filter + ',"], '
                + '*[data-visible-for*=",' + filter + ',"], '
                + '*[data-visible-for$=",' + filter + '"], '
                + '*[data-visible-for="' + filter + '"], '
                + '*[data-hidden-for]'
                    + ':not([data-hidden-for^="' + filter + ',"])'
                    + ':not([data-hidden-for*=",' + filter + ',"])'
                    + ':not([data-hidden-for$=",' + filter + '"])'
                    + ':not([data-hidden-for="' + filter + '"])'
            );

            rows_to_hide
                .slideUp('fast', function() {
                    // On hide all rows, trigger change in some input to update shortcode
                    $('#shortcode_form_show_label').change();
                })
                .find('input[type="text"][data-clear-if-empty="true"]').val('');

            rows_to_show.slideDown('fast', function() {
                // On show all rows, trigger change in some input to update shortcode
                $('#shortcode_form_show_label').change();
            });
        });

        $('#shortcode_form_filter').change();

        $('body').on('click', '#edd-ajax-filters-shortcode-form .add-group', function(e) {
            e.preventDefault();

            var container = $(this).parent();

            $( '<div class="option-group" style="display: none;">' + container.find('.option-group').first().html() + '</div>').insertBefore( $(this) ).slideDown('fast');

            edd_ajax_filters_check_remove_groups( container );

            $('#shortcode_form_filter').change(); // Trigger change event to update shortcode
        });

        $('body').on('click', '#edd-ajax-filters-shortcode-form .option-group .remove-group', function(e) {
            e.preventDefault();

            if( ! $(this).prop('disabled') ) {
                $(this).closest('.option-group').slideUp('fast', function() {
                    var container = $(this).parent();

                    $(this).remove();

                    edd_ajax_filters_check_remove_groups( container );

                    $('#shortcode_form_filter').change(); // Trigger change event to update shortcode
                });
            }
        });

        function edd_ajax_filters_check_remove_groups( container ) {
            var disabled = true;

            if( container.find('.option-group').length > 1 ) {
                disabled = false;
            }

            container.find('.remove-group').prop('disabled', disabled);
        }

        wp.hooks.addFilter( 'uFramework_shortcode_attr_options_options', function(override, element) {
            if( ! element.is(':visible') ) {
                return '';
            }

            var options = [];

            element.find('.option-group').each(function() {

                if( $(this).find('input[name="value"]').val() !== '' || $(this).find('input[name="text"]').val() !== '' ) {
                    options.push(
                        '"' + $(this).find('input[name="value"]').val() + '":' +
                        '"' + $(this).find('input[name="text"]').val() + '"'
                    );
                }
            });

            if( options.length ) {
                override = ' options="{' + options.join(', ') + '}"';
            } else {
                override = '';
            }

            return override;
        } );

        wp.hooks.addFilter( 'uFramework_shortcode_attr_range_group_options', function(override, element) {
            if( ! element.is(':visible') ) {
                return '';
            }

            var options = [];

            element.find('.option-group').each(function() {

                if( $(this).find('input[name="min"]').val() !== '' || $(this).find('input[name="max"]').val() !== '' || $(this).find('input[name="text"]').val() !== '' ) {
                    options.push(
                        '"' + $(this).find('input[name="min"]').val() + ':' + $(this).find('input[name="max"]').val() + '":' +
                        '"' + $(this).find('input[name="text"]').val() + '"'
                    );
                }
            });

            if( options.length ) {
                override = ' options="{' + options.join(', ') + '}"';
            } else {
                override = '';
            }

            return override;
        } );

        wp.hooks.addFilter( 'uFramework_shortcode_attr_order_group_options', function(override, element) {
            if( ! element.is(':visible') ) {
                return '';
            }

            var options = [];

            element.find('.option-group').each(function() {
                options.push(
                    '"' + $(this).find('select[name="field"]').val() + ':' + $(this).find('select[name="direction"]').val() + '":' +
                    '"' + $(this).find('input[name="text"]').val() + '"'
                );
            });

            if( options.length ) {
                override = ' options="{' + options.join(', ') + '}"';
            } else {
                override = '';
            }

            return override;
        } );
    }
})(jQuery);